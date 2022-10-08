const Header = ({ course }) => <h1>{course}</h1>
	
const Total = ({ sum }) => <b>Total of excercises {sum}</b>
	
const Part = ({ part }) =>
	<p>
	{part.name} {part.exercises}
	</p>
	
const Content = ({ part }) =>
	<>
	<Part part={part}/>
	</>
	
const Course = ({ course }) => {
	const total = course.parts.reduce(function(previousValue, currentValue){
        return previousValue + currentValue.exercises}, 0)
	  
	return (
	<div>
	    <Header course={course.name} />
	    <>
        {course.parts.map(part =>
	    <Content key={part.id} part={part} />
	    )}
	    </>
        <Total sum = {total}/>
	    </div>
	  )
	}
	

export default Course
