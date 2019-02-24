import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CreateClassroomForm from '../Forms/CreateClassroomForm'
import CreateBatchForm from '../Forms/CreateBatchForm'
import CreateLectureForm from '../Forms/CreateLectureForm';

const useStyles = makeStyles(theme => ({
	root: {
		width: '90%'
	},
	button: {
		marginRight: '2em'
	},
	instructions: {
		marginTop: '2em',
		marginBottom: '2em'
	}
}))

function getSteps() {
	return [
		'Create a classroom',
		'Create batches for the classroom',
		'Create lectures for the batch'
	]
}

function getStepContent(step, edit) {
	switch (step) {
		case 0:
			return <CreateClassroomForm edit={edit}/>
		case 1:
			return <CreateBatchForm edit={edit}/>
		case 2:
			return <CreateLectureForm edit={edit}/>
		default:
			return 'Unknown step'
	}
}

function ClassroomCreationStepper({edit}) {
	const classes = useStyles()
	const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
	const steps = getSteps()

	// function isStepOptional(step) {
	//   return step === 2||step===1;
	// }

	function isStepSkipped(step) {
		return skipped.has(step)
	}

	function handleNext() {
		let newSkipped = skipped
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values())
			newSkipped.delete(activeStep)
		}

		setActiveStep(prevActiveStep => prevActiveStep + 1)
		setSkipped(newSkipped)
	}

	function handleBack() {
		setActiveStep(prevActiveStep => prevActiveStep - 1)
	}

	// function handleSkip() {
	//   if (!isStepOptional(activeStep)) {
	//     // You probably want to guard against something like this,
	//     // it should never occur unless someone's actively trying to break something.
	//     throw new Error("You can't skip a step that isn't optional.");
	//   }

	//   setActiveStep(prevActiveStep => prevActiveStep + 1);
	//   setSkipped(prevSkipped => {
	//     const newSkipped = new Set(prevSkipped.values());
	//     newSkipped.add(activeStep);
	//     return newSkipped;
	//   });
	// }

	function handleReset() {
		setActiveStep(0)
	}

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {}
					const labelProps = {}
					// if (isStepOptional(index)) {
					//   labelProps.optional = <Typography variant="caption">Optional</Typography>;
					// }
					if (isStepSkipped(index)) {
						stepProps.completed = false
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					)
				})}
			</Stepper>
			<div>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed - you&apos;re finished
						</Typography>
						<Button onClick={handleReset} className={classes.button}>
							Reset
						</Button>
					</div>
				) : (
					<div>
						{getStepContent(activeStep, edit)}
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								disabled={activeStep === 0}
								onClick={handleBack}
								className={classes.button}>
								Back
							</Button>
							{/* {isStepOptional(activeStep) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )} */}
							<Button
								// variant="contained"
								color="primary"
								onClick={handleNext}
								className={classes.button}>
								{activeStep === steps.length - 1 ? 'Finish' : 'Next'}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ClassroomCreationStepper
