import React from 'react'
import { Button, Checkbox, Label, Select, TextInput, Radio, Datepicker } from "flowbite-react";

export default function Registration() {
    return (
        <form action="">
            <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
                
                <div className="mb-4 col-span-full xl:mb-2">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        Registration
                    </h1>
                </div>
                {/* <!-- Right Content --> */}
                <div className="col-span-full xl:col-auto">
                    <div
                        className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
                    >
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">
                            Origin
                        </h3>
                        <div className="mb-4">
                            <Label
                                htmlFor="settings-language"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                value='Diocese/Organization' />
                            <Select
                                id="dioceseOrOrg"
                                name="dioceseOrOrg"
                                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option>Select here</option>
                                <option>Diocese 1</option>
                                <option>Organization 1</option>
                            </Select>
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="parishOrLocalUnit"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Parish/Local Unit</label>
                            <Select
                                id="parishOrLocalUnit"
                                name="countries"
                                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                                <option>Select here</option>
                                <option>Parish 1</option>
                                <option>Local Unit 1</option>
                            </Select>
                        </div>
                    </div>
                    <div
                        className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
                    >
                        <div className="flow-root">
                            <h3 className="text-xl font-semibold dark:text-white">Contact Person (In case of emergency)</h3>
                            <div className="mb-4">
                                <Label
                                    htmlFor="settings-language"
                                    className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Contact Person' />
                                <TextInput
                                    type="text"
                                    name="emerContactPerson"
                                    id="emerContactPerson"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    // placeholder="Contact Person"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="settings-language"
                                    className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Contact Person' />
                                <TextInput
                                    type="text"
                                    name="emerContactPerson"
                                    id="emerContactPerson"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    // placeholder="Contact Person"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="settings-language"
                                    className="block my-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Contact Person' />
                                <TextInput
                                    type="text"
                                    name="emerContactPerson"
                                    id="emerContactPerson"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    // placeholder="Contact Person"
                                    required
                                />
                            </div>



                        </div>
                    </div>

                </div>
                <div className="col-span-2">
                    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">
                            Personal Details
                        </h3>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Title' />
                                <Select
                                    id="title"
                                    name="title"
                                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                    <option>Select here</option>
                                    <option>Mr.</option>
                                    <option>Ms.</option>
                                </Select>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="nickname"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Nickname' />
                                <TextInput
                                    type="text"
                                    name="nickname"
                                    id="nickname"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Green"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="birthday"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Birthday' />
                                <Datepicker
                                    name="birthday"
                                    id="birthday"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="contactNumber"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Contact Number' />
                                <TextInput
                                    type="number"
                                    name="contactNumber"
                                    id="contactNumber"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="e.g. 09951234567"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="address"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Address' />
                                <TextInput
                                    type="text"
                                    name="address"
                                    id="address"
                                    // className=" text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="e.g. California"
                                    required
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="roleInMinistry"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Role In Ministry' />
                                <TextInput
                                    type="text"
                                    name="roleInMinistry"
                                    id="roleInMinistry"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="shirtSize"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Shirt Size' />
                                <Select
                                    id="title"
                                    name="title"
                                // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                >
                                    <option>Select here</option>
                                    <option>Small</option>
                                    <option>Medium</option>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <div
                        className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800"
                    >
                        <h3 className="mb-4 text-xl font-semibold dark:text-white">
                            Health Declaration (Leave empty if none)
                        </h3>

                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="allergy"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Allergy: Have you ever suffered from any allergy? (e.g. medicine, food, etc.)' />

                                <TextInput
                                    type="text"
                                    name="allergy"
                                    id="allergy"
                                    placeholder="If yes, please provide details"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="medication"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Are you on regular medication?' />
                                <TextInput
                                    type="text"
                                    name=""
                                    id="current-password"
                                    placeholder="If yes, please provide details"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="current-password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Do you have a special diet? (e.g. vegetarian, meat, fish, salt, etc.)' />
                                <TextInput
                                    type="text"
                                    name=""
                                    id="current-password"
                                    placeholder="If yes, please provide details"
                                    required
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <Label
                                    htmlFor="current-password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    value='Are you a PWD who will require mobility assistance?' />

                                <TextInput
                                    type="text"
                                    name=""
                                    id="current-password"
                                    placeholder="If yes, please provide details"
                                    required
                                />
                            </div>
                            
                        </div>
                        <div className='mt-10 flex items-center justify-center'>
                            <Button color="blue" className='w-60 h-16'>Save All</Button>
                        </div>
                    </div>

                </div>
                
            </div>
            </form>
     
    )
}
