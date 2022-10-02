import React from 'react';
import Webcam from "react-webcam";
import {url,model_url} from '../Url';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Voternav from '../Navbar/Voternav';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

const webcamRef = React.createRef();
 
  class Verifyface extends React.Component {
    
        state={
            image:"",
            iscaptured:false,
            granted:false,
            isDisable:false,
            loading:false,
            btnDisable:true,
            alertMsg:"",
            color:"",
            modal: true
        }
            
     
        toggle = () => {
          this.setState({
            modal: !this.state.modal
          });
        }
     

      componentDidMount = () =>{

        if(!this.props.location.state)
        {
        
            this.props.history.push('/'); 
            return;
        }
      
        // alert(this.props.location.state.token);
        navigator.permissions.query({ name: "camera" }).then(res => {
            if(res.state !== "granted"){
               alert("Please Grant Camera Permission"); 
              
            }
            else
            {
              this.setState({
                granted:true
              })
            }
        });
      }


      
     capture = () => {
         const imageSrc = webcamRef.current.getScreenshot();
         this.setState({
             image:imageSrc,
             iscaptured:true

         })
      }
     
      
   
   compare = () =>{
    
    this.setState({
      loading:true
  })

  fetch(`${model_url}/compare`,{
        headers: { 
          'Content-Type': 'application/json',
          "Authorization":this.props.location.state.token
         },
           method:"POST",
           body:JSON.stringify({
               img1:this.state.image,
               img2:""


           })
       })
       .then(res=>res.json())
       .then(data=>{
        this.setState({
          loading:false
      })
        console.log(data);
       

        if(!data.error)
        {
          alert("Photo Matching");
          this.props.history.push({
            pathname: '/vote',
          
            state:{verified:true,token1:data.token1,token2:data.token2}
         });

         window.location.reload();
       
         return;
         }

        if(data.expired)
        {
            alert("Session Expired");
            this.props.history.push('/'); 
            window.location.reload();
            return;
        }

        if(data.match == false)
        {
          alert("photo not matching");
          return;
        }

        alert(data.error);
      })
       .catch(err=>{
        this.setState({
          loading:false
      })
       })
   }

   

    render()
    {
      if(!this.state.granted)
      {
        return <h1>Please Grant Camera Permission</h1>
      }
    return (
      <div>
        <Voternav/>

        <Modal isOpen={this.state.modal}  className={this.props.className}>
          <ModalHeader >Guidlines</ModalHeader>
          <ModalBody>
          1. Do not cover the webcam at any point.<br/>
          2. Do not cover or mask your face and do not change seating posture.<br/>
          3. Maintain a proper lighting while capturing the image from the webcam , so that the face will be clearly visible.<br/>
          4. Do not try to fake the identity of someone else that coluld lead to disqualification of the vote.<br/>
          5. After clicking the image press on proceed button to proceed further.
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.toggle}>Proceed</Button>{' '}
          </ModalFooter>
        </Modal>
      
   <div className="container" >
         <div className="row justify-content-center">
        <div className="col-md-6">
         {!this.state.iscaptured ? 
        <div >
            
        
        <Webcam 
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={520}
          videoConstraints={videoConstraints}
         
          
        />

        <button className="btn btn-info col-12" onClick={this.capture}>Capture</button>
        </div>
    : 
    <div>
        <img src={this.state.image} alt="" className="mt-5"  />
        <br /><br />
       <button className="btn btn-info col-5" onClick={()=>this.setState({iscaptured:false})} disabled={this.state.loading?true:false}>Retake</button>
       <button  className="btn btn-info col-5 ml-5 " onClick={this.compare} disabled={this.state.loading?true:false} >{this.state.loading?"Comparing...":"OK"}</button>
    </div>}
    </div>
</div>

</div>
</div>

    );
    }
  };
  export default Verifyface;