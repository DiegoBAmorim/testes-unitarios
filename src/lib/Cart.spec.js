import Cart from './Cart';

describe('Cart', () => {
  let cart;
  let product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  };

  let product2 = {
    title: 'Adidas running shoes - women',
    price: 41872,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 whe getTotal() is executed in a newly created instance ', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2, //70776
      };

      cart.add(item);

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('should ensure no more than one product exists at a time ', () => {
      cart.add({
        product,
        quantity: 2, //70776
      });

      cart.add({
        product,
        quantity: 1, //70776
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });

    it('should update total when a product gets included and then remove', () => {
      cart.add({
        product,
        quantity: 2, //70776
      });

      cart.add({
        product: product2,
        quantity: 1, //70776
      });

      cart.remove(product);

      expect(cart.getTotal().getAmount()).toEqual(41872);
    });
  });

  describe('checkout()', () => {
    it('should return an object with the total and list of items', () => {
      cart.add({
        product,
        quantity: 2, //70776
      });

      cart.add({
        product: product2,
        quantity: 3, //70776
      });
      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should return an object with the total and list of items when summary() is called', () => {
      cart.add({
        product,
        quantity: 2, //70776
      });

      cart.add({
        product: product2,
        quantity: 3, //70776
      });
      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });

    it('should include formatted amount in the summary', () => {
      cart.add({
        product,
        quantity: 5, //70776
      });

      cart.add({
        product: product2,
        quantity: 3, //70776
      });
      expect(cart.summary().formatted).toEqual('R$3,025.56');
    });

    it('should reset the cart when checkout', () => {
      cart.add({
        product: product2,
        quantity: 3, //70776
      });

      cart.checkout();

      expect(cart.getTotal().getAmount()).toEqual(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('should receive two or more conditions and deterimne/apply the best discount. First case. ', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [condition, condition2],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });

    it('should receive two or more conditions and deterimne/apply the best discount. Second case. ', () => {
      const condition = {
        percentage: 80,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [condition, condition2],
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });
  });
});
