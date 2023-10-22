const express = require("express");

const router = express.Router();

const contacts = require("../../models/contacts");
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  const result = await contacts.listContacts();
  res.json(result);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.json(result);
});

router.post("/", async (req, res, next) => {
  const result = await contacts.addContact(req.body);

  const { error } = addSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }

  res.status(201).json(result);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  const { error } = addSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  }
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
});

module.exports = router;
