import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Close from '@material-ui/icons/Close'
import { connect } from "react-redux";
import { setDialog } from "../../actions";

const mapDispatchToProps = dispatch => {
  return { setDialog: state => dispatch(setDialog(state)) };
};
const mapStateToProps = state => {
  return { dialogState: state.myreducer.dialogState };
};

function SimpleDialog(props) {
	const { fullScreen, children, dialogState, setDialog, ...other } = props

	const handleClose = value => {
		setDialog({open:false});
		console.log(typeof(props.close))
		if(typeof(props.close)!=='undefined'){props.close()}
	}
	return (
		<Dialog
			fullScreen={fullScreen}
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={dialogState.open}
			{...other}
			scroll="body"
			style={{ zIndex: '1500' }}>
			<div
				style={{ display: 'flex', justifyContent: 'flex-end', padding: '1em' }}>
				<Button onClick={handleClose} autoFocus className="redButton">
					CLOSE <Close style={{ marginLeft: '5px' }} />
				</Button>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					paddingBottom: '1em'
				}}>
				{children}
			</div>
		</Dialog>
	)
}


export default connect(mapStateToProps,mapDispatchToProps)(withMobileDialog()(SimpleDialog))
