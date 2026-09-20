"""
NESSA AI — Endpoint de autenticação (auth).

Endpoints:
  POST /api/v1/auth/register → cria novo usuário
  POST /api/v1/auth/login → autentica e retorna token JWT
  GET  /api/v1/auth/me → retorna dados do usuário autenticado
"""

from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import get_settings
from app.models.user import User as UserModel
from app.schemas.auth import Token, User, UserCreate, UserLogin

router = APIRouter(prefix="/auth", tags=["Autenticação"])

settings = get_settings()

# Contexto para hash de senha (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme para tokens JWT
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se uma senha em texto puro corresponde ao hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Gera hash seguro para uma senha."""
    return pwd_context.hash(password)


def get_user_by_email(db: Session, email: str) -> UserModel | None:
    """Busca usuário pelo e-mail."""
    return db.query(UserModel).filter(UserModel.email == email).first()


def create_user(db: Session, user_data: UserCreate) -> UserModel:
    """Cria um novo usuário no banco de dados."""
    # Verificar se o e-mail já existe
    existing_user = get_user_by_email(db, user_data.email.lower())
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma conta com este e-mail.",
        )

    # Criar hash da senha
    password_hash = get_password_hash(user_data.password)

    # Criar usuário
    db_user = UserModel(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=password_hash,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def authenticate_user(db: Session, email: str, password: str) -> UserModel | None:
    """Autentica usuário verificando e-mail e senha."""
    user = get_user_by_email(db, email.lower())
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Cria um token JWT de acesso."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Registra um novo usuário.

    - **name**: Nome do usuário (obrigatório, mínimo 2 caracteres)
    - **email**: E-mail válido (obrigatório, único)
    - **password**: Senha (obrigatória, mínimo 6 caracteres)

    Retorna os dados do usuário criado (sem o password_hash).
    """
    # Validar comprimento da senha
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A senha deve ter pelo menos 6 caracteres.",
        )

    # Validar nome
    if len(user_data.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nome deve ter pelo menos 2 caracteres.",
        )

    try:
        db_user = create_user(db, user_data)
        return User.model_validate(db_user)
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar usuário.",
        )


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)) -> Any:
    """
    Autentica usuário e retorna token JWT.

    - **email**: E-mail do usuário
    - **password**: Senha do usuário

    Retorna access_token e token_type.
    """
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário inativo.",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def read_users_me(
    current_user: UserModel = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retorna dados do usuário autenticado.

    Requer token JWT válido no header Authorization.
    """
    # Buscar usuário atual pelo e-mail no token
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário inativo.",
        )

    return User.model_validate(user)
