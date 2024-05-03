import {ClassConstructor, plainToInstance} from "class-transformer";
import {validateOrReject, ValidationError} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

/**
 * Middleware to validate and transform the request body to a target class.
 * @param {ClassConstructor<T>} targetClass
 * The target class to transform the request body into.
 * @return {Function}
 * An Express.js middleware function.
 */
export function validateBody<T extends object>(
  targetClass: ClassConstructor<T>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ensure the request body has the expected format
    const messageData = req.body?.message?.data;
    if (!messageData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({error: "Invalid request body format."});
    }

    // Decode and parse the JSON data
    let parsedData;
    try {
      const decoded = Buffer
        .from(messageData, "base64")
        .toString("utf-8");
      parsedData = JSON.parse(decoded);
    } catch (error) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({error: "Invalid JSON data."});
    }

    // Ensure that parsed data is an object
    if (typeof parsedData !== "object" || parsedData === null) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({error: "Parsed data is not a valid object."});
    }

    // Transform to the specified class and validate
    const instance = plainToInstance(targetClass, parsedData);

    try {
      await validateOrReject(instance); // Validate the transformed instance
      req.body = Object
        .setPrototypeOf(
          instance,
          targetClass.prototype
        ); // Set the prototype
      return next(); // Proceed to the next middleware
    } catch (validationErrors) {
      if (Array.isArray(validationErrors) &&
         validationErrors[0] instanceof ValidationError
      ) {
        const firstError = validationErrors[0];
        const errorMessage = Object
          .values(firstError.constraints || {})
          .join(", ");
        console.error(`Validation error: ${errorMessage}`);
        return res
          .status(StatusCodes.UNPROCESSABLE_ENTITY)
          .json({error: errorMessage});
      }

      // Handle unexpected validation errors
      console.error("Unexpected validation error:", validationErrors);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error: "An internal server error occurred."});
    }
  };
}
