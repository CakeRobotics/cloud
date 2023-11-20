import React from 'react'

class CarouselImage extends React.Component {
    render() {
        return (
            <div style={{
                width: '100%', height: '30em',
                backgroundImage: 'url(' + require('../img/' + this.props.imgkey + '.jpg').default + ')',
                boxShadow: 'inset 0px -50px 30px -20px #fcfcfc',
                // boxShadow: 'inset 0px -30p   x 0px -20px #fcfcfc',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            </div>
        );
    }
}

export default CarouselImage;
