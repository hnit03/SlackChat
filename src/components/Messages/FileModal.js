import React from 'react';
import mime from 'mime-types';
import { Button, Icon, Input, Modal } from "semantic-ui-react";

class FileModal extends React.Component {

    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    addFile = (event) =>{
        const file = event.target.files[0];
        if(file){
            this.setState({ file });
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    sendFile = () =>{
        const { file } = this.state;
        const { uploadFile,closeModal } = this.props;
    
        if(file !== null){
            if (this.isAuthorized(file.name)) {
                const metedata = { contentType: mime.lookup(file.name) }
                uploadFile(file,metedata);
                closeModal();
                this.clearFile();
            }
        }
    }

    clearFile = () => this.setState({ file:null });

    render(){

        const { modal, closeModal } =this.props;

        return (
            <Modal basic open={modal} onClose={closeModal} >
                <Modal.Header>Select an image</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        name="file"
                        type="file"
                        onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.sendFile}>
                        <Icon name="checkmark" /> Send 
                    </Button>

                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel 
                    </Button>
                </Modal.Actions>

            </Modal>
        )
    }
}

export default FileModal
