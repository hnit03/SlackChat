import React, { Component } from "react";
import { Icon, Menu } from "semantic-ui-react";

class Channels extends Component{

    state = {
        channels: []
    }

    render(){
        const {channels} = this.state;
        return(
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> Channels
                    </span>
                    ({channels.length}) <Icon name="add" />
                </Menu.Item>
            </Menu.Menu>
        );
    }
}

export default Channels;