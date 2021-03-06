import React, { useState, useEffect, useRef } from "react";
import ProductImage from "../assets/product.png";

import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";

//svgs
import { ReactComponent as Close } from "../assets/close.svg";
import { ReactComponent as Chevron } from "../assets/chevron.svg";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";

const Product = () => {
  const ease = [0.6, 0.05, -0.01, 0.99]
  const x = useSpring(0, { stiffness: 300, damping: 200, ease: ease });
  const width = useTransform(x, [-1060, 0], [450, 0]);
  const scale = useTransform(x, [-100, 0], [1.25, 1]); 
  const fadeIn = useTransform(x, [-100, 0], [1, 0])
  const fadeOut = useTransform(x, [-60, 0], [0, 1])
  const up = useTransform(x, [-100, 0], [-100, 0])
  const down = useTransform(x, [-100, 0], [100, 0])

  let htmlElement = document.querySelector("html")
  const imageElement = useRef(null)

  const [isSliderOnFocus, setIsSliderOnFocus] = useState(false);

  useEffect(() => {
    x.onChange(() => {
      x.get() > -100 ? setIsSliderOnFocus(false) : setIsSliderOnFocus(true);
    })
  }, [x])

  useEffect(() => {
    isSliderOnFocus ? htmlElement.classList.add("no-scroll") : htmlElement.classList.remove("no-scroll")	
  }, [isSliderOnFocus, htmlElement.classList])
  
  // Center image scroll on state changes
  useEffect(() => {
    if (isSliderOnFocus) {
      document.querySelector(".product-image").scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [imageElement.offsetHeight, isSliderOnFocus])

  const closeProductDrag = () => {
    x.stop();
    x.set(0)
  }

  return (
    <div className='product'>
      <div className='product-inner'>
        <div className='product-content'>
          <motion.div 
            style={{ translateY: up }}
            className='product-content-inner'
          >
            <h4>Freedom Everywhere</h4>
            <h1>HiFive1 Rev B</h1>
            <p>
              HiFive1 is a low-cost, Arduino-compatible development board
              featuring the Freedom E310. It???s the best way to start prototyping
              and developing your RISC???V applications.
            </p>
            <div className='btn-row'>
              <button>Buy Now ($59)</button>
              <DownArrow />
            </div>
          </motion.div>
        </div>
      </div>
      <div className='product-slide-enlarge'>
        <motion.div
          style={{ opacity: fadeIn }}
          className='background'
        />

        {isSliderOnFocus ? (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: -30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -30 }} 
              transition={{ ease }}
              className='product-drag-header'
              ref={imageElement}
            >
              <div className='company-name'>HiFive1</div>
              <div onClick={closeProductDrag} className='close'>
                <Close />
              </div>
            </motion.div>
          </AnimatePresence>
        ) :  (
          <AnimatePresence />
        )}

        <div className='product-container'>
          <motion.div 
            style={{ x, scale }} 
            drag={'x'} 
            dragConstraints={{ left: -1060, right: 0 }} 
            dragElastic={0.05} 
            className='product-image'
          >
            <img src={ProductImage} alt='product' />
          </motion.div>
        </div>
        <motion.div 
          style={{ paddingBottom: down }} 
          className='product-drag'
        >
          <div className='product-drag-inner'>
            <div className='product-drag-label'>
              <motion.h6 style={{ opacity: fadeOut, x }}>
                <Chevron />
                Drag To Enlarge
              </motion.h6>
            </div>
            <div className='product-drag-progress-background'>
              <motion.div 
                style={{ width }}
                className='product-drag-progress'
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Product;
