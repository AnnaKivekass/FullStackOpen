const Header = (props) => {
  console.log('Header props:', props)
  return <h1>{props.name}</h1>
}

const Part = (props) => {
  console.log('Part props:', props)

  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  console.log('Content props:', props)
  console.log('Content parts:', props.parts)

  return (
    <div>
      {props.parts.map((part) => {
        console.log('Rendering part:', part)

        return (
          <Part
            key={part.id}
            name={part.name}
            exercises={part.exercises}
          />
        )
      })}
    </div>
  )
}

const Total = (props) => {
  console.log('Total props:', props)

  const total = props.parts.reduce((sum, part) => {
    console.log('reduce step:', sum, part)
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
  console.log('Course props:', props)

  const { course } = props
  console.log('Course object:', course)
  console.log('Course parts:', course.parts)

  return (
    <div>
      <h2>{course.name}</h2>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  console.log('App renders')

  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ]

  console.log('Courses data:', courses)

  return (
    <div>
      <h1>Web development curriculum</h1>

      {courses.map((course) => {
        console.log('Rendering course:', course)
        return <Course key={course.id} course={course} />
      })}
    </div>
  )
}

export default App
