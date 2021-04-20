import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import DirectMessage from "./DirectMessage";
import UserPanel from "./UserPanel";
import Starred from "./Starred";

class SidePanel extends Component{
    state = {
        activeChannel:''
    }

    setActiveChannel = channelID =>{
        this.setState({ activeChannel: channelID });
    }

    render(){

        const { currentUser } = this.props;
        const { activeChannel } = this.state;

        return(
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical 
                style={{backgroundColor: '#3498db', fontSize:'1.2rem'}}
            >
                <UserPanel currentUser={ currentUser }/>
                <Starred currentUser={ currentUser } />
                <Channels 
                    activeChannel={activeChannel}
                    setActiveChannel={this.setActiveChannel}
                    currentUser={ currentUser }
                />
                <DirectMessage 
                    activeChannel={activeChannel}
                    currentUser={ currentUser } 
                    setActiveChannel={this.setActiveChannel}
                />
            </Menu>
        );
    }
}

export default SidePanel;