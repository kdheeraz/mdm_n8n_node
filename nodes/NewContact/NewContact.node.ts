import { IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError
} from 'n8n-workflow';

export class NewContact implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CreateContactAction',
		name: 'NewContactAction',
		group: ['transform'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'NewContactAction',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Contact Email',
				name: 'email',
				type: 'string',
				default: '',
				placeholder: 'contact creation fn',
				description: 'The description text',
			},

			{
				displayName: 'First Name',
				name: 'fname',
				type: 'string',
				default: '',
				placeholder: 'contact creation fn',
				description: 'The description text',
			},

			{
				displayName: 'Bearer Token',
				name: 'bearer',
				type: 'string',
				default: '',
				placeholder: 'contact creation fn',
				description: 'The description text',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('email', itemIndex, '') as string;
				item = items[itemIndex];
                
				let email = myString


				item.json['email'] = myString;
                
				let bearer = myString = this.getNodeParameter('bearer', itemIndex, '') as string;


				const options = {
					method: "POST",
					headers:{
						"Authorization":bearer
					},
					uri: "https://prime.mobilytixdigital.com/api/v1/single_contact",
					json: true,
					body:{contact_info:{Email:email}}
				  };
				  
				  const response = await this.helpers.request(options);
				  
				  return this.prepareOutputData([response]);


			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
