
import React, { useState } from "react";
import "./Home.css";
import { images } from "../../Helpers/CarouselData";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Carousel } from 'react-bootstrap';
import Slider1 from "../../Images/gt_slide01.jpg";
import Slider2 from "../../Images/gt_slide02.jpg";
import Slider3 from "../../Images/gt_slide03.jpg";
import Slider4 from "../../Images/gt_slide04.jpg";
import Slider5 from "../../Images/gt_slide05.jpg";
import Slider6 from "../../Images/gt_slide06.jpg";
import Slider7 from "../../Images/gt_slide07.jpg";
import Slider8 from "../../Images/gt_slide08.jpg";
import Slider9 from "../../Images/gt_slide09.jpg";
export const Home = () => {
  const [currImg, setCurrImg] = useState(0);
console.log('images :>> ', images);
    const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel fade activeIndex={index} onSelect={handleSelect}>
    <Carousel.Item>
      <img
        // className="d-block 
        src={Slider1}
        alt="First slide"
      />
      <Carousel.Caption>
        <h3>-----Glutape-----</h3>
        <h3>ACHEM WONDER</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item > 
      <img
        className="d-block "
        src={Slider2}
        alt="Second slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>BIESSSE</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item >
      <img
        className="d-block "
        src={Slider3}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>ESTAPE</h3>
      </Carousel.Caption>
      
    </Carousel.Item>
    <Carousel.Item >
      <img
        className="d-block "
        src={Slider4}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>GRIPPEX</h3>
      </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img
        className="d-block "
        src={Slider5}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>GRIPPO</h3>
      </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img
        className="d-block "
        src={Slider6}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>IKULOR</h3>
      </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img
        className="d-block "
        src={Slider7}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>SEAL KING</h3>
      </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item >
      <img
        className="d-block "
        src={Slider8}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>KEEP DISTANCE, STAY TOGETHER</h3>
      </Carousel.Caption>
      
    </Carousel.Item>
    <Carousel.Item >
      <img
        className="d-block "
        src={Slider9}
        alt="Third slide"
      />

      <Carousel.Caption>
      <h3>-----Glutape-----</h3>
        <h3>PVC FLOOR MARKING</h3>
      </Carousel.Caption>
      

    </Carousel.Item>

  </Carousel>
  
    // <div className="carousel">
    //   <div
    //     className="carouselInner"
    //     style={{ backgroundImage: `url(${images[currImg].img})` }}
    //   >
    //     <div
    //       className="left"
    //       onClick={() => {
    //         currImg > 0 && setCurrImg(currImg - 1);
    //       }}
    //     >
    //       <ArrowBackIosNewIcon style={{ fontSize: 30 }} />
    //     </div>
    //     <div className="center">
    //       <h1>{images[currImg].title}</h1>
    //       <p>{images[currImg].subtitle}</p>
    //     </div>
    //     <div
    //       className="right"
    //       onClick={() => {
    //         currImg < images.length - 1 && setCurrImg(currImg + 1);
    //       }}
    //     >
    //       <ArrowForwardIosIcon style={{ fontSize: 30 }} />
    //     </div>
    //   </div>
    // </div>

  );
};
