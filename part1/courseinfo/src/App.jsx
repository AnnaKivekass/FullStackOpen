const Header = (props) => {
  return <h1>{props.name}</h1>
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => {
    console.log('what is happening', sum, part)
    return sum + part.exercises
  }, 0)

  console.log('Total exercises:', total)

  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  )
}

const Course = (props) => {
  const { course } = props

  console.log('course:', course)

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      { name: 'Fundamentals of React', exercises: 1, id: 1 },
      { name: 'Using props to pass data', exercises: 70, id: 2 },
      { name: 'State of a component', exercises: 14, id: 3 },
      { name: 'Redux', exercises: 11, id: 4 }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
