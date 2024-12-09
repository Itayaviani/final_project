const Contact = require('../models/ContactModel');


exports.createContact = async (req, res) => {
  try {

    const newContact = await Contact.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newContact,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};


exports.getAllContacts = async (req, res) => {
  try {

    const contacts = await Contact.find();

    res.status(200).json({
      status: 'success',
      data: contacts,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};


exports.deleteContact = async (req, res) => {
  try {

    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        status: 'fail',
        message: 'No contact found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
