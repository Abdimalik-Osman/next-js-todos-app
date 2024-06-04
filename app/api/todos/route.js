import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function GET(req) {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  const todos = JSON.parse(fileContents);
  return new Response(JSON.stringify(todos), { status: 200 });
}

export async function POST(req) {
  const newTodo = await req.json();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  const todos = JSON.parse(fileContents);
  newTodo.id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  todos.push(newTodo);
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  return new Response(JSON.stringify(newTodo), { status: 201 });
}

export async function PUT(req) {
  const updatedTodo = await req.json();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  let todos = JSON.parse(fileContents);
  todos = todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo));
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  return new Response(JSON.stringify(updatedTodo), { status: 200 });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  let todos = JSON.parse(fileContents);
  todos = todos.filter(todo => todo.id !== id);
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  return new Response(null, { status: 204 });
}