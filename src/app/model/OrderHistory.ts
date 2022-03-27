import { OrderHeader } from './Order';

export class OrderHistory {
  private _feedbackId: number = -1;
  private _grade: number = 0;
  private _feedbackContent: string = '';
  private _orderHeader: OrderHeader = new OrderHeader();

  constructor(
    feedbackId: number,
    grade: number,
    feedbackContent: string,
    orderHeader: OrderHeader
  ) {
    this._feedbackId = feedbackId;
    this._grade = grade;
    this._feedbackContent = feedbackContent;
    this._orderHeader = orderHeader;
  }

    /**
     * Getter feedbackId
     * @return {number }
     */
	public get feedbackId(): number  {
		return this._feedbackId;
	}

    /**
     * Getter grade
     * @return {number }
     */
	public get grade(): number  {
		return this._grade;
	}

    /**
     * Getter feedbackContent
     * @return {string }
     */
	public get feedbackContent(): string  {
		return this._feedbackContent;
	}

    /**
     * Getter orderHeader
     * @return {OrderHeader }
     */
	public get orderHeader(): OrderHeader  {
		return this._orderHeader;
	}

    /**
     * Setter feedbackId
     * @param {number } value
     */
	public set feedbackId(value: number ) {
		this._feedbackId = value;
	}

    /**
     * Setter grade
     * @param {number } value
     */
	public set grade(value: number ) {
		this._grade = value;
	}

    /**
     * Setter feedbackContent
     * @param {string } value
     */
	public set feedbackContent(value: string ) {
		this._feedbackContent = value;
	}

    /**
     * Setter orderHeader
     * @param {OrderHeader } value
     */
	public set orderHeader(value: OrderHeader ) {
		this._orderHeader = value;
	}
  
}
