import React from 'react';
import { Carousel, CarouselItem, Button } from 'react-bootstrap';
import CarouselImage from '../components/CarouselImage';

import './homepage.css';

class Homepage extends React.Component {
    componentDidMount() {
        setTimeout(this.preload_images.bind(this), 3000);
    }

    preload_images() {
        const imagesPreload = [
            require('../img/online-ide.jpg').default,
            require('../img/cloud-simulation.jpg').default,
            require('../img/cloud-services.jpg').default,
        ];
    
        // const imagesPreload = ['./img/online-ide.jpg', './img/cloud-simulation.jpg', './img/cloud-services.jpg'];
        imagesPreload.forEach((image) => {
            const newImage = new Image();
            newImage.src = image;
            window[image] = newImage;
        });
    }

    render() {
        return (
            <div className="App-content">
                <Carousel
                    variant="dark"
                    // interval={null}
                    >
                    <CarouselItem interval="10000">
                    <CarouselImage imgkey="code-efficiently"/>
                    <Carousel.Caption>
                        <h1>Efficient Robot Programming</h1>
                        <h4>Our high-level libraries allow you to focus on the task.</h4>
                    </Carousel.Caption>
                    </CarouselItem>
                    <CarouselItem>
                    <CarouselImage imgkey="online-ide"/>
                    <Carousel.Caption>
                        <h1>Online IDE</h1>
                        <h4>You don't need to install anything on your computer or robot.</h4>
                    </Carousel.Caption>
                    </CarouselItem>
                    <CarouselItem>
                    <CarouselImage imgkey="cloud-simulation"/>
                    <Carousel.Caption>
                        <h1>Cloud Simulation</h1>
                        <h4>Test your code in a simulated world before deploying.</h4>
                    </Carousel.Caption>
                    </CarouselItem>
                    <CarouselItem interval="7000">
                    <CarouselImage imgkey="cloud-services"/>
                    <Carousel.Caption>
                        <h1>Cloud Services</h1>
                        <h4>We provide cloud interfaces for navigation, speech recognition and vision.</h4>
                    </Carousel.Caption>
                    </CarouselItem>
                </Carousel>
                <div className="homepage-lower-area">
                    <div className="homepage-btn-gp">
                    <Button size="lg" href="/docs">Learn More</Button>
                    <Button size="lg" className="btn-success" href="https://cloud.cakerobotics.com/auth/register">Sign Up</Button>
                    </div>
                    <p>Already have an account? Login <a href="https://cloud.cakerobotics.com/auth/login">here</a>.</p>
                </div>
            </div>
        );
    }
}

export default Homepage;
