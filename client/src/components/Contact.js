import React from "react";
import { FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

const Contact = ({ handleSubmit, handleChange, alertMessage }) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6">
                        <FormControl id="pseudo">
                            <FormLabel>Votre pseudo*</FormLabel>
                            <Input name="pseudo" id="pseudo" onChange={handleChange} className={`feedback-input `} type="text" placeholder="Votre pseudo" />
                        </FormControl>
                        {alertMessage && <div className="text-danger">{alertMessage}</div>}
                    </div>
                    <div className="col-lg-6">
                        <FormControl id="subject">
                            <FormLabel>Sujet du message*</FormLabel>
                            <Input name="subject" id="subject" onChange={handleChange} className={`feedback-input`} type="text" placeholder="Le sujet" />
                        </FormControl>
                        {alertMessage && <div className="text-danger">{alertMessage}</div>}
                    </div>
                    <div className="col-lg-12">
                        <FormControl id="email">
                            <FormLabel>Votre email*</FormLabel>
                            <Input name="email" id="email" onChange={handleChange} className={`feedback-input`} type="email" placeholder="Votre email" />
                        </FormControl>
                        {alertMessage && <div className="text-danger">{alertMessage}</div>}
                    </div>
                    <div className="col-lg-12">
                        <FormControl id="text">
                            <FormLabel>Message*</FormLabel>
                            <Textarea name="message" id="message" onChange={handleChange} className={`feedback-input`} placeholder="Entrez votre message ici..." />
                        </FormControl>
                        {alertMessage && <div className="text-danger">{alertMessage}</div>}
                    </div>
                    <button className="btn btn-light w-100">Envoyer</button>
                </div>
            </form>
        </>
    );
};

export default Contact;
