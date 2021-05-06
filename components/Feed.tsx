import React, { useState, useEffect, useContext } from 'react'
import { supabaseClient } from '../lib/supabase'
import { Button } from './Button'
import { Input } from './Input'
import { Project } from './Project'
import { Context } from "../lib/useContext";

type User = {
  id?: boolean
  user: any
}


interface Props {
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = (props: Props) => {
  return (
    <div> 
      <input
        type="checkbox"
        checked={props.isChecked}
        onChange={props.onChange}
      />
    </div>
  );
};

export default function Todos({ user }: User) {
  const [todos, setTodos] = useState([])
//  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setError] = useState('')
  const [newTaskText, setNewTaskText] = useContext(Context);

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
//    let { data: todos, error } = await supabase.from('todos').select('*').order('id', true)
    let { data: todos, error } = await supabaseClient.from('projects').select('*').order('id', { ascending: true }) 
    
    if (error) console.log('error', error)
    else setTodos(todos)
  }
  const addTodo = async (taskText: string) => {
    let task = taskText.trim()
    if (task.length) {
      let { data: todo, error } = await supabaseClient
        .from('projects')
        .insert({ task, user_id: user.id })
        .single()
      if (error) setError(error.message)
      else setTodos([...todos, todo])
    }
  }

  const deleteTodo = async (id: any) => {
    try {
      await supabaseClient.from('projects').delete().eq('id', id)
      setTodos(todos.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="w-full">
     
      <div className="flex gap-2 my-2">
         <h1>Here {newTaskText}</h1>
        <Input
          className="rounded w-full p-2"
          type="text"
          placeholder="create project"
          value={newTaskText}
          onChange={(e) => {
            setError('')
            setNewTaskText(e.target.value)
          }}
        />
        <Button color="black" onClick={() => addTodo(newTaskText)}>
          Create
        </Button>


        
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="shadow overflow-hidden rounded-md">
        <div className="grid gap-4 grid-cols-3 md:grid-rows-2  my-2">
          
          {todos.map((todo) => ( 
            <Project key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

 

const Alert = ({ text }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)