/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import userEvent from '@testing-library/user-event'
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill form should appear", () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      //to-do write assertion
      const billForm = screen.getByTestId("form-new-bill")
      expect(billForm).toBeTruthy()
    })

    test("File should be changed if I change the file", () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      //to-do write assertion
      const billForm = screen.getByTestId("form-new-bill")
      expect(billForm).toBeTruthy()
      const file = new File(['image'], 'image.png', {type: 'image/png'})
      const files = screen.getByTestId('file')
      expect(files).toBeTruthy() 
      const handleChangeFileFunction = jest.fn((e) => newBill.handleChangeFile(e))
      files.addEventListener('change', handleChangeFileFunction)
      userEvent.upload(files, file)
      expect(files.files[0].name).toBeDefined()
      fireEvent.change(files)
      expect(handleChangeFileFunction).toHaveBeenCalled
      const fileExtension = files.files[0].name.split(".").pop()
      expect(["jpg", "jpeg", "png"]).toContain(fileExtension)
    })

    test("Then handleSubmit should have been called when clicked on sumbit", () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      //to-do write assertion
      const billForm = screen.getByTestId("form-new-bill")
      expect(billForm).toBeTruthy()
      const handleSubmitBtn = jest.fn((e) => newBill.handleSubmit(e))
      billForm.addEventListener('submit', handleSubmitBtn)
      fireEvent.submit(billForm)
      expect(handleSubmitBtn).toHaveBeenCalled()
    })

    test("Create a new bill", async () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      //to-do write assertion
      const billForm = screen.getByTestId("form-new-bill")
      expect(billForm).toBeTruthy()

      const bill = {
        "id": "qcCK3SzECmaZAGRrHjaC",
        "status": "refused",
        "pct": 20,
        "amount": 200,
        "email": "a@a",
        "name": "test2",
        "vat": "40",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2002-02-02",
        "commentAdmin": "pas la bonne facture",
        "commentary": "test2",
        "type": "Restaurants et bars",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      };

      const createBill = await mockStore.bills().create(bill);
      expect(createBill).toEqual({
        fileUrl: "https://localhost:3456/images/test.jpg",
        key: "1234"
      });
    })
  })
})

// describe("Given I am connected as an employee", () => {
//   describe("When I click on new bill button", () => {
//     test("I should see the new bill form", async () => {

//     })
//   })
// })