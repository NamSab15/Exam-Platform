class ExamConfigException(Exception):
    """Base exception for all exam configuration errors."""
    pass


class ExamNotFoundError(ExamConfigException):
    """Exception raised when an exam configuration is not found."""
    pass


class ConfigLockedError(ExamConfigException):
    """Exception raised when attempting to modify locked configuration."""
    pass


class DuplicateCandidateError(ExamConfigException):
    """Exception raised when a candidate is already added."""
    pass


class InvalidCSVError(ExamConfigException):
    """Exception raised when the CSV file has invalid format or headers."""
    pass
