from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

    # RevenueCat customer/app user ID
    revenuecat_user_id = Column(String, unique=True, nullable=True)

    # Backend-controlled subscription state
    is_pro = Column(Boolean, default=False, nullable=False)