class CustomError extends Error {
    constructor(message) {
        super(message)
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class UnauthorizeError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}

class ForbiddenError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = 403
    }
}

module.exports = {
    CustomError,
    NotFoundError,
    BadRequestError,
    UnauthorizeError,
    ForbiddenError
}