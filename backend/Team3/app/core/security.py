from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Standard Bearer token authentication schema
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency to verify a Keycloak JWT and retrieve user information.
    Currently mocks token verification, returning a dict containing user_id, tenant_id, and role.
    If the token contains 'admin', 'candidate', or 'proctor', we assign that role accordingly.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header token",
        )

    # Determine mock role based on token content for testing
    role = "exam_creator"  # Default mock role
    if "admin" in token.lower():
        role = "tenant_admin"
    elif "candidate" in token.lower():
        role = "candidate"
    elif "proctor" in token.lower():
        role = "proctor"

    # Mock user details extracted from Keycloak JWT payload
    return {
        "user_id": "usr-mock-candidate",
        "tenant_id": "tenant-mock-company",
        "email": "candidate@xebia.com",
        "role": role,
    }


def require_role(allowed_roles: List[str]):
    """
    Dependency factory to check if the current user has one of the allowed roles.
    """
    def dependency(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' is not authorized to access this resource. Allowed roles: {allowed_roles}",
            )
        return current_user
    return dependency
