'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import styles from './page.module.css'; // Import the CSS module

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState('');

  console.log(todos)
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const todos = await res.json();
    setTodos(todos);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo, completed: false }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const updateTodo = async (updatedTodo) => {
    await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });
    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    setEditing(null);
  };

  const toggleComplete = async (id) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    updatedTodo.completed = !updatedTodo.completed;
    await updateTodo(updatedTodo);
  };
  const deleteTodo = async (id) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Container className={styles.container}>
      <Row className="my-4 justify-content-center">
        <Col md="8">
          <h1 className="text-center">Todo List</h1>
          <Form onSubmit={addTodo}>
            <FormGroup>
              <Label for="newTodo">New Todo</Label>
              <Input
                type="text"
                name="newTodo"
                id="newTodo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter a new task"
                required
              />
            </FormGroup>
            <Button color="primary" type="submit" className="w-100">Add Todo</Button>
          </Form>
          <ListGroup className="mt-4">
            {todos.map(todo => (
              <ListGroupItem key={todo.id} className="d-flex justify-content-between align-items-center">
                {editing === todo.id ? (
                  <>
                    <Input
                      style={{width:"70%"}}
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div>
                      <Button color="success" className="mx-3" onClick={() => updateTodo({ ...todo, title: editingText })}>
                        Save
                      </Button>
                      <Button color="secondary" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{textDecoration:todo.completed ? 'line-through':""}}>
                      {todo.title}
                    </p>
                    <div>
                      <Button color="success" className="me-2" onClick={() => toggleComplete(todo.id)}>
                        {todo.completed ? 'Undo' : 'Complete'}
                      </Button>
                      <Button color="info" className="me-2" onClick={() => { setEditing(todo.id); setEditingText(todo.title); }}>
                        Edit
                      </Button>
                      <Button color="danger" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
