import type { IncomingMessage, ServerResponse } from 'http';

export interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
}

export interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (body: any) => VercelResponse;
}
