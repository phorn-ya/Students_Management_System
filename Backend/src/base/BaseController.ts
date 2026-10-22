import type { Request, Response } from 'express';
export class BaseController {

  protected sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 400, data?: any) {
    res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  }
  protected async handleAsyncError(res: Response, asyncFn: () => Promise<void>) {
    try {
      await asyncFn();
    } catch (error: any) {
      console.error('Controller Error:', error);
      this.sendError(res, error.message || 'Internal server error', 500);
    }
  }
}
