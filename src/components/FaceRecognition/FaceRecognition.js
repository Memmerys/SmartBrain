import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
    return (
        <div className='center ma'>
         <div className='absolute mt2'>
            <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto' />
            {box.map((face, i) => (
                <div className='bounding-box' style={{top: face.topRow, right: face.rightCol, bottom:face.bottomRow, left: face.leftCol}} key={i}></div>
            ))
            }
         </div>
        </div>
    )
}

export default FaceRecognition;