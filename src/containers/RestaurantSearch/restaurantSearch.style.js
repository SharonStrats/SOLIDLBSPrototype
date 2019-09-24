import styled from 'styled-components';

import { media } from '../../utils';

export const RestaurantSearchWrapper = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('/img/concentric-hex-pattern_2x.png');
    background-repeat: repeat;
    min-height: 79vh;
    padding: 60px 0;
`;
export const RestaurantSearchContainer = styled.div`
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    background-color: white;
    max-width: 900px;
    margin: 0 20px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    ${media.tablet`
    height: 90%;
  `}
`;

export const Header = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-image: url('/img/pattern-geo.png'),
        linear-gradient(135deg, #7c4dff 0%, #18a9e6 50%, #01c9ea 100%);
    background-repeat: repeat, no-repeat;
    padding: 30px 20px;

    .edit-button {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid white;
        color: white;
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 1rem;
    }
`;

export const Form = styled.form`
    padding: 20px 40px;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px 40px;
    ${media.tablet`
    grid-template-columns: 1fr 1fr;
  `}
`;

export const Button = styled.button`
    max-width: 128px;
    display: inline-block;

    &:first-child {
        margin-right: 10px;
    }
`;

export const FullGridSize = styled.div`
    grid-column: span 1;
    text-align: right;
    ${media.tablet`
    grid-column: span 2;
  `}
`;

export const WebId = styled.div`
    padding: 20px 40px 0px 40px;
    position: relative;
    &:after{
      background-color: #d8d8d8;
    display: block;
    content: "";
    height: 1px;
    width: 100%;
    margin: 25px 0 0 0;
    }
    a {
        display: inline-block;
        word-break: break-all;
        margin-left: 10px;
    }
`;

export const ShexForm = styled.div`
border: solid #cacaca 1px;
background: #f9f9f9;
    label {
      clear: both;
    }
    & .shexForm {
        border: none;
        background: transparent;
        box-sizing: border-box;
        padding: 0 12px;
    }

    & .shexPanel {
        border: solid #cacaca 1px;
        background: #ffffff;
        box-sizing: border-box;
        padding: 12px;
        position: relative;
    }

    & .shexRoot {
        border: none;
        background: transparent;
    }

    & .deleteButton {
        margin: 0 4px 0 12px;
        position: relative;
        float: right;
        width: 100px;
        color: #fb4a3e;
        border-color: #fb4a3e;
        &:hover {
            background: rgba(251, 74, 62, 0.8);
            color: #fff;
        }
    }

    & .addButton {
        width: 210px;
        color: rgb(145, 194, 250);
        border-color: rgb(145, 194, 250);
        background: #fff;
        padding: 5px 30px;
        &:hover {
            background: rgba(145, 194, 250, 0.8);
            color: #fff;
        }

        & .inputContainer {
            padding: 12px;
        }
    }
`;
export const WelcomeWrapper = styled.section`
  top:0;
  bottom:0;
  overflow-y:auto;
  overflow-x:visible;
  position:relative;
  padding: 0;
  width:100%;
  height:100%;
  align-items: center;
  justify-content: center;
  h3 {
    color: #666666;
    span {
      font-weight: bold;
    }
    a {
      font-size: 1.9rem;
    }
  }
`;

export const WelcomeCard = styled.div`
  background-color: #fff;
  
  margin: 30px auto;
  max-width:1200px;

  //Overriding the style guide card flexbox settings
  flex-direction: column !important;
  padding: 0 !important; //temporary fix to a style guide bug

  align-items: center;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    margin-left: 8px;
  }
`;

export const WeatherContainer = styled.div`
  max-width:1200px;
  display: flex;
  position:relative;
  flex-direction: row !important;
  align-items: center;
  margin: 30px auto;
  height:60% !important;
`;

export const LocationInputContainer = styled.div`
  flex-direction: row;
`

export const LocationInput = styled.div`

`

export const GoButton = styled.button`
  background-color: #333333;
  color: #eeeeee;
`



export const WelcomeLogo = styled.div`
  width: 50%;
  height: 100%;
  img {
    width: 60%;
    display: block;
    margin: 0 auto;
  }
`;

export const WelcomeProfile = styled.div`
  height: 100%;
  text-align: center;
  position: relative;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  h1,
  img {
    margin: 0 10px;
    display: inline-block;
    vertical-align: middle;
  }

  ${media.tablet`
    width: 50%;
    &:after {
      display: block;
      content: "";
      position: absolute;
      height: 100%;
      width: 1px;
      background-color:#D0D0D0;
      top:0;
    }
  `}
`;

export const ImageWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;

button {
  margin-left: 0px;
}
`;



export const AutoSaveNotification = styled.section`
  margin-bottom:0px !important;
`;
