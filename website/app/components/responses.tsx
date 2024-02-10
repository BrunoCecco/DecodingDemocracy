import React from 'react';

interface IResponse {
  0: number; // id
  1: string; // question_id
  2: number; // responder_id
  3: string; // response
  4: number; // consultation_id
  5: number; // sentiment value
  6: string; // primary topic
}

const Response = ({ response }: { response: IResponse }) => {
  return (
    <tr className="text-sm">
      <td>{response[0]}</td>
      <td>{response[2]}</td>
      <td>{response[3]}</td>
      <td>{response[5] || 'n/a'}</td>
      <td>{response[6]?.split('-')[2] || 'n/a'}</td>
    </tr>
  );
};

const Responses = ({ responses }: { responses: IResponse[] }) => {
  return (
    <table className="w-full border-separate border-spacing-2 table-fixed">
      <thead>
        <tr className="border-b border-black">
          <th className="text-left w-[10%]">No.</th>
          <th className="text-left w-[10%]">Responder</th>
          <th className="text-left w-[50%]">Response</th>
          <th className="text-left w-[15%]">Sentiment</th>
          <th className="text-left w-[15%]">Primary Topic</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((response: IResponse, i) => {
          return <Response key={i} response={response} />;
        })}
      </tbody>
    </table>
  );
};

export default Responses;
