from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Standard Bearer token authentication schema
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency to verify a Keycloak JWT and retrieve user information.
    Currently mocks token verification, returning a dict containing user_id and tenant_id.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header token",
        )

    # Mock user details extracted from Keycloak JWT payload
    return {
        "user_id": "usr-mock-candidate",
        "tenant_id": "tenant-mock-company",
        "email": "candidate@xebia.com",
    }
