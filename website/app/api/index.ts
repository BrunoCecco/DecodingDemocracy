// File handles all API requests to the server

// Function to make a GET request to the server
export const getRequest = async (url: string) => {
  try {
    const response = await fetch(`${url}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// '/api/responses/:questionid?offset=0&limit=10' - get responses for a question
export const getResponses = async (
  questionid: string,
  offset: number,
  limit: number,
  order?: string // optional parameter
) => {
  if (order) {
    return await getRequest(
      `/api/responses/${questionid}?offset=${offset}&limit=${limit}&order=${order}`
    );
  }
  return await getRequest(
    `/api/responses/${questionid}?offset=${offset}&limit=${limit}`
  );
};

// '/api/responses/search/:questionid/:term?offset=0&limit=10' - search responses for a question
export const searchResponses = async (
  questionid: string,
  term: string,
  offset: number,
  limit: number
) => {
  const encodedSearchTerm = encodeURIComponent(term);
  return await getRequest(
    `/api/responses/search/${questionid}/${encodedSearchTerm}?offset=${offset}&limit=${limit}`
  );
};

// '/api/responses/similar/:questionid/:term?offset=0&limit=10' - search similar responses for a question
export const searchSimilarResponses = async (
  questionid: string,
  text: string,
  offset: number,
  limit: number
) => {
  const encodedSearchTerm = encodeURIComponent(text);
  return await getRequest(
    `/api/responses/similar/${questionid}/${encodedSearchTerm}?offset=${offset}&limit=${limit}`
  );
};

// '/api/topics/search/:questionid/:topic?offset=0&limit=10' - search responses for a given topic
export const searchResponseTopics = async (
  questionid: string,
  topic: string,
  offset: number,
  limit: number
) => {
  return await getRequest(
    `/api/topics/search/${questionid}/${topic}?offset=${offset}&limit=${limit}`
  );
};

// '/api/questions/:questionid' - get question details
export const getQuestion = async (questionid: string) => {
  return await getRequest(`/api/questions/${questionid}`);
};

// '/api/responses/sentiment/:questionid' - get overall sentiment for a question
export const getSentiment = async (questionid: string) => {
  return await getRequest(`/api/responses/sentiment/${questionid}`);
};

// '/api/topics/sentiment/:topicid' - get sentiment for a topic
export const getSentimentForTopic = async (topicid: string) => {
  return await getRequest(`/api/topics/sentiment/${topicid}`);
};

// '/api/topics/:questionid' - get topics for a question
export const getTopics = async (questionid: string) => {
  return await getRequest(`/api/topics/${questionid}`);
};

// '/api/topics/topwords/:topicid?limit=10' - get top words for a topic
export const getTopWords = async (topic: string, limit: number) => {
  const data = await getRequest(`/api/topics/topwords/${topic}?limit=${limit}`);
  const chart_data = {
    labels: data.map((item: any) => item.word),
    datasets: [
      {
        data: data.map((item: any) => item.word_value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  return chart_data; // return chart data
};

// '/api/topics/numresponses/:topic' - get number of responses for a topic
export const getNumWordsForTopic = async (topic: string) => {
  return await getRequest(`/api/topics/numresponses/${topic}`);
};

// '/api/topics/common/:questionid?limit=10' - get common topics for a question
export const getCommonTopics = async (
  questionid: string,
  topicsLimit: number,
  wordsLimit: number
) => {
  const topics = await getRequest(
    `/api/topics/common/${questionid}?limit=${topicsLimit}`
  );

  // get common words for each topic
  const promises = topics.map(async (topic: any) => {
    const data = await getRequest(
      `/api/topics/topwords/${topic.topic_id}?limit=${wordsLimit}`
    );
    const chart_data = {
      labels: data.map((item: any) => item.word),
      datasets: [
        {
          data: data.map((item: any) => item.word_value),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    // return topic data, including chart data for top words
    return [topic.topic_id, chart_data, topic.topic_count];
  });

  const topicsWithWords = await Promise.all(promises);
  return topicsWithWords;
};

// '/api/responses/multiplechoice/:questionid' - get multiple choice responses for a question
export const getMultipleChoice = async (questionid: string) => {
  return await getRequest(`/api/responses/multiplechoice/${questionid}`);
};

// '/api/questions/wordcloud/:questionid' - get wordcloud for a question
export const getWordcloud = async (questionid: string) => {
  return await getRequest(`/api/questions/wordcloud/${questionid}`);
};
