"use strict";

const REST_BASE_URL = 'https://idefix.informatik.htw-dresden.de:8888/api';

const REST_USER = 's86265@htw-dresden.de';
const REST_PASSWORD = 'quizapp';

function authHeader() {
  const token = btoa(`${REST_USER}:${REST_PASSWORD}`);
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/json', // Ensure the content type is set to JSON
    'Accept': 'application/json' // Ensure the response is in JSON format
    };
}

export async function getQuestions() {

  // Bedauerlicherweise weiß ich nicht die richtigen ID's bzw. Pages für die Kategorien, die ich hinzugefügt habe.
  // Demzufolge entsprechen die Kategorie nicht den Kategorie in der App (IT).
  const response = await fetch(`${REST_BASE_URL}/quizzes?page=100`, {
    method: 'GET',
    headers: authHeader()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()).content || [];

}

export async function getQuestionById(id) {

  const response = await fetch(`${REST_BASE_URL}/quizzes/${id}`, {
    method: 'GET',
    headers: authHeader()
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();

}

export async function submitAnswer(questionId, index) {
  const response = await fetch(`${REST_BASE_URL}/quizzes/${questionId}/solve`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify([index])
  });

  const body = await response.json();

  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    if (body && body.message) {
      errorMsg += `\nServer message: ${body.message}`;
    } else if (typeof body === 'string') {
      errorMsg += `\nServer message: ${body}`;
    }
    throw new Error(errorMsg);
  }

  return body;

}