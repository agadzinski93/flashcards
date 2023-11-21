import "./Button.scss"

interface Props {
    text:string,
    onClickButton? : () => void;
}

const Button = ({text, onClickButton} : Props) => {

const button = (onClickButton) ? 
    <button className="hi" onClick={onClickButton}>{text}</button> :
    <button className="hi" >{text}</button>;
  return (
    button
  )
}

export default Button;