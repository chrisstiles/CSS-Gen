import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { 
	addNotification, 
	getNotificationTypes, 
	getNaturalImageSize, 
	getImageSize 
} from '../util/helpers';

class FileDrop extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showOverlay: false,
			lastTarget: null,
			isLoading: false
		};

		this.fileTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

		// Max file size for droped images. Although we don't 
		// save these to a server, we prevent large images as they 
		//impact performance and browsers have local starge limitations
		this.maxFileSize = 2000000;
	}

	componentDidMount() {
		window.addEventListener('dragenter', this.handleDragEnter);
		window.addEventListener('dragover', this.handleDragOver);
		window.addEventListener('dragleave', this.handleDragLeave);
		window.addEventListener('drop', this.handleDrop);
	}

	componentWillUnmount() {
		window.removeEventListener('dragenter', this.handleDragEnter);
		window.removeEventListener('dragover', this.handleDragOver);
		window.removeEventListener('dragleave', this.handleDragLeave);
		window.removeEventListener('drop', this.handleDrop);
	}

	hideOverlay = () => {
		this.setState({ isLoading: false, showOverlay: false });
	}

	handleDragEnter = event => {
		event.preventDefault();

		const { types } = event.dataTransfer;

		if (types && types[0] === 'Files') {
			this.setState({ showOverlay: true, lastTarget: event.target });
		}
	}

	handleDragOver = event => {
	  event.stopPropagation();
	  event.preventDefault();
	}

	handleDragLeave = event => {
		event.stopPropagation();
		event.preventDefault();
		if (event.target === this.state.lastTarget) {
			this.hideOverlay();
		}
	}

	handleDrop = event => {
		event.stopPropagation();
		event.preventDefault();

		if (!this.state.showOverlay) {
			return;
		}

		this.setState({ isLoading: true });
		const files = event.dataTransfer.files;
		const notificationTypes = getNotificationTypes();
		const generalError = 'Error previewing file';
		let error = null;

		if (!files) {
			// No files present
			error = generalError;
		} else if (files.length > 1) {
			// Tried to add multiple files
			error = 'You can only preview one image at a time';
		} else if (files[0].size > this.maxFileSize) {
			error = `Max file size of ${this.maxFileSize / 1000000}mb`;
		} else {
			const extension = files[0].name.split('.').pop().toLowerCase();

			if (this.fileTypes.indexOf(extension) === -1) {
				// File type not supported
				error = 'File type not supported';
			}
		}

		if (error) {
			setTimeout(() => {
				addNotification(notificationTypes.error, error);
				this.hideOverlay();
			}, 400);
		} else {
			const file = files[0];
			const reader = new FileReader();

			// File successfully loaded
			reader.onload = e => {
			  const image = e.target.result;

				getNaturalImageSize(image).then(({ width: naturalWidth, height: naturalHeight }) => {
			    // Image successfully added
			    setTimeout(() => {
			    	const { width, height } = getImageSize(naturalWidth, naturalHeight);
			    	addNotification(notificationTypes.success, 'Image added!');

			    	if (this.props.onFileDrop) {
			    		this.props.onFileDrop({ width, height, image });
			    	}

			    	this.hideOverlay();
			    }, 300);

			  }).catch(() => {
			  	setTimeout(() => {
			  		addNotification(notificationTypes.error, error);
			  		this.hideOverlay();
			  	}, 600);
			  });
			}

			// Error loading file
			reader.onerror = () => {
				addNotification(notificationTypes.error, generalError);
				this.hideOverlay();
			}

			reader.readAsDataURL(file);
		}
	}

	render() {
		let content;
		if (this.state.isLoading) {
			content = <LoadingSpinner color="#fff" />;
		} else {
			content = (
				<div className="content">
					<div className="icon" />
					<div className="title">Drop your image here to preview</div>
					<div className="subtitle">Supported file types: jpg, png, svg</div>
				</div>
			);
		}

		const className = this.state.showOverlay ? 'visible' : '';

		return (
			<div id="file-drop" className={className}>
				{content}
			</div>
		);
	}
}

export default FileDrop;