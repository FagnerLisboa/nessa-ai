"""
NESSA AI — Schemas Pydantic para autenticação e usuário.

Contratos de requisição/resposta para endpoints de auth.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Campos base do usuário."""

    name: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema para criação de usuário (registro)."""

    password: str


class UserLogin(BaseModel):
    """Schema para login de usuário."""

    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema para resposta de token JWT."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Dados do token JWT."""

    email: Optional[str] = None


class UserInDBBase(UserBase):
    """Campos do usuário armazenados no banco (sem senha)."""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDBBase):
    """Schema público do usuário (resposta da API)."""

    pass


class UserWithPassword(User):
    """Schema interno com hash da senha (nunca retornado na resposta)."""

    password_hash: str
