export interface IResponse {
  id: number;
  question_id: string;
  responder_id: number;
  response: string;
  consultation_id: number;
  sentiment_value?: number;
  topic_id: string;
  similarity_score?: number;
}
