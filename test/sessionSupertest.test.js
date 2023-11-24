import supertest from "supertest";
import { expect } from "chai";

const requester = supertest('http://localhost:8080')