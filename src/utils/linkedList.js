function Node(element) {
  this.element = element;
  this.next = null;
  this.setNext = (value) => { this.next = value; };
}

function LinkedList() {
  this.head = null;
  this.size = 0;

  this.add = (element) => {
    const node = new Node(element);
    let current = null;

    if (!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }
  };

  this.insertAt = (element, index) => {
    if (index > 0 && index > this.size) {
      return false;
    }

    const node = new Node(element);

    let current = this.head;
    let previous = null;

    if (index === 0) {
      node.next = current;
      this.head = node;
    } else {
      let count = 0;
      current = this.head;

      while (count < index) {
        count += 1;
        previous = current;
        current = current.next;
      }

      node.next = current;
      previous.next = node;
    }

    this.size += 1;

    return current;
  };

  this.removeFrom = (element, index) => {
    if (index > 0 && index > this.size) {
      return -1;
    }

    let current = this.head;
    let previous = current;
    let count = 0;

    if (index === 0) {
      this.head = current.next;
    } else {
      while (count < index) {
        count += 1;
        previous = current;
        current = current.next;
      }

      previous.next = current.next;
    }

    this.size -= 1;

    return current.element;
  };

  this.removeElement = (element) => {
    let current = this.head;
    let previous = null;

    while (current !== null) {
      if (current.element === element) {
        if (previous === null) {
          this.head = current.next;
        } else {
          previous.next = current.next;
        }

        this.size -= 1;
        return current.element;
      }

      previous = current;
      current = current.next;
    }

    return -1;
  };

  this.indexOf = (element) => {
    let count = 0;
    let current = this.head;

    while (current !== null) {
      if (current.element === element) {
        return count;
      }

      count += 1;
      current = current.next;
    }

    return -1;
  };

  this.getListAsString = () => {
    let current = this.head;
    let text = '';

    while (current) {
      text += `${current.element}`;
      current = current.next;
    }

    return text;
  };

  this.getList = () => {
    const list = [];
    let current = this.head;

    while (current) {
      list.push(current);
      current = current.next;
    }

    return list;
  };

  this.getSize = () => this.size;
  this.isEmpty = () => this.size === 0;
}

export default LinkedList;
