require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageData.json');

imageDatas = ((imageDatasArr) => {
  for(let i = 0, j = imageDatasArr.length; i < j; ++i){
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class ControllerUnit extends React.Component{
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    let className = "controller-unit";
    if(this.props.arrange.isCenter){
      className += " is-center";
      if(this.props.arrange.isInverse){
        className += " is-inverse";
      }
    }
    return(
      <span className={className} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

class ImgFigure extends React.Component {
    handleClick(e){
      if(this.props.arrange.isCenter) this.props.inverse();
      else this.props.center();

      e.stopPropagation();
      e.preventDefault();
    }
    render(){
      let style = {};
      if(this.props.arrange.pos){
        style = this.props.arrange.pos;
      }
      if(this.props.arrange.rotate){
        ['Moz', 'ms', 'Webkit'].forEach(value => {
          style[value+'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
        })
        style.transform = 'rotate(' + this.props.arrange.rotate + 'deg)'
      }
      if(this.props.arrange.isCenter){
        style.zIndex = 11
      }
      let imgFigureClassName = "img-figure";
      imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ''

      return(
        <figure className={imgFigureClassName} style={style} onClick={this.handleClick.bind(this)}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="image-title">{this.props.data.title}</h2>
          </figcaption>
          <div className="img-back">
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figure>
      )
    }
}

function getRangeRandom(low, high){
  return Math.floor(Math.random() * (high - low) + low);
}
/*
 * 获取0～30度之间的任意正负值
 */
function get30DegRandom(){
  return getRangeRandom(-30, 30);
}

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgsArrangeArr:[
            /*{
              pos: {
                left: '0',
                top: '0'
              }
              rotate: 0,
              isInverse: false
              isCenter: false
            }*/
          ],
        controllerUnits:[
        ]
      };
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange:{
        leftSecX: [0,0],
        rightSecX: [0,0],
        y:[0,0]
      },
      vPosRange:{
        x: [0, 0],
        topY: [0,0]
      }
    };
  }

  /*
   * 反转图片
   * @param index 被反转的图片的index
   * @return {Function}
   */
  inverse(index){
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }

  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = getRangeRandom(0, 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

      imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      };

      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
      imgsArrangeTopArr.forEach((value, index)=>{
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom()
          }
      });

      for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; ++i){
        let hPosRangeLORX = null;
        if(i < k){
          hPosRangeLORX = hPosRangeLeftSecX;
        }else{
          hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos: {
            top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        }
      }

      if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
      console.log(imgsArrangeArr);
  }

  componentDidMount(){
    let stageDOM = this.refs.stage,
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  /*
   * 居中图片
   * @param index 需要被居中的图片index
   */
  center(index){
    return () => this.rearrange(index)
  }

  render() {
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageDatas.map((value, index) => {
            if(!this.state.imgsArrangeArr[index]){
              this.state.imgsArrangeArr[index] = {
                pos:{
                  left: 0,
                  top: 0
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
              }
            }
            return(<ImgFigure
                      key={index}
                      data={value}
                      arrange={this.state.imgsArrangeArr[index]}
                      ref={'imageFigure' + index}
                      inverse={this.inverse(index)}
                      center={this.center(index)}
                    />)
          })}
        </section>
        <nav className="controller-nav">
          {imageDatas.map((value, index)=>{
              return(
                <ControllerUnit
                  key={index}
                  arrange={this.state.imgsArrangeArr[index]}
                  inverse={this.inverse(index)}
                  center={this.center(index)}
                />
              )
          })}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
