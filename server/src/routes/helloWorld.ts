import { Request, Response, response } from "express";

/**
 *
 * @param req - Request object
 * @param res - Response object
 * @returns The response of the request
 */
const helloWorld = async (req: Request, res: Response) => {
  return res.status(200).end();
};

export default helloWorld;
