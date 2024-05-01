import {ClassConstructor, plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

/**
 * Validates and transforms the request body to the target class.
 * @param {T} targetClass
 * The target class to transform the request body to.
 * @return {Function}
 * A middleware function for Express.js.
 */
export function validateBody<T>(targetClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.message.data) {
      res.status(StatusCodes.BAD_REQUEST).send("Invalid request body format.");
    }

    const instance = plainToInstance(targetClass, req.body.message.data);

    if (typeof instance === "object" && instance !== null) {
      try {
        await validateOrReject(instance);
        req.body = Object.setPrototypeOf(req.body, targetClass.prototype);
        next();
      } catch (err) {
        if (Array.isArray(err) && err.length > 0 && "constraints" in err[0]) {
          const message = Object.values(err[0].constraints)[0];
          res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .send({message});
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(
              "An unknown error occurred during validation of the request body."
            );
        }
      }
    } else {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send("Instance is not an object.");
    }
  };
}
