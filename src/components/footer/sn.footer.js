import React from "react";
import { Link, Grid } from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord,  } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import classes from './Footer.css';
import { APP_BG_COLOR } from '../../sn.constants';


class SnFooter extends React.Component {

    render() {
        return (
            <footer className={classes.fixfooter}>
                <Grid container className={classes.root} spacing={1} justify="center" alignContent="center">
                    <Grid item className="font-weight-bold">
                        <Link href="https://github.com/skynethubio/skhub-appstore-ui#donation" 
                            target="_blank" rel="noreferrer"
                            style={{color: APP_BG_COLOR}}>Donate</Link>
                        <span className="FooterTextspan">|</span>
                    </Grid>
                    <Grid item className="font-weight-bold">
                        <Link href="privacy.html" target="_blank" rel="noreferrer" style={{color: APP_BG_COLOR}}>Privacy</Link>
                        <span className="FooterTextspan">|</span>
                    </Grid>
                    <Grid item className="font-weight-bold">
                    <Link href="#" style={{color: APP_BG_COLOR}}>Terms</Link>
                    <span className="FooterTextspan">|</span>
                    </Grid>
                    <Grid item>
                        <a href="https://twitter.com/HelloSkySpaces" target="_blank"
                            rel="noopener noreferrer" className="FooterTextspan">
                            <FontAwesomeIcon icon={faTwitter} size="1x" />
                        </a>
                    </Grid>
                    <Grid item>
                        <a href="https://discord.gg/w7TWJR" target="_blank"
                            rel="noopener noreferrer" className="FooterTextspan">
                            <FontAwesomeIcon icon={faDiscord} size="1x" />
                        </a>
                    </Grid>
                    <Grid item>
                        <a href="  https://feedback-skyspaces.herokuapp.com" target="_blank"
                            rel="noopener noreferrer" className="FooterTextspan">
                            <FontAwesomeIcon icon={faCommentAlt} size="1x" />
                        </a>
                    </Grid>
                    <Grid item>
                        <a href="mailto:hello@skyspaces.io" target="_blank"
                        rel="noopener noreferrer" className="FooterTextspan">
                            <FontAwesomeIcon icon={faEnvelope} size="1x" />
                        </a>
                   </Grid>
                </Grid>
                
            </footer>
        );
    }
}

export default SnFooter;