import { collectionData, docData, snapToData, doc } from 'rxfire/firestore';
import { map, startWith } from 'rxjs/operators';
import { lowerCaseFirstLetter, pluralize } from '/src/lib/utils/strings';
import { firestore } from '/src/services/firebase';

export default class Model {
  constructor(data, { parent = null } = {}) {
    this.id = 0;
    this.parent = null;

    for (let key in data) {
      this[key] = data[key];
    }
    this.parent = parent;
  }

  static add(props, { parent = null } = {}) {
    let collectionPath = this.getCollectionId();
    let documentRef;

    if (parent) {
      collectionPath = parent.getDocumentPath() + '/' + collectionPath;
    }
    let { id, ...otherProps } = props;
    if (id) {
      const documentPath = collectionPath + '/' + id;
      documentRef = firestore.doc(documentPath);
      documentRef.set(otherProps);
    } else {
      const collectionRef = firestore.collection(collectionPath);
      documentRef = collectionRef.add(props);
    }
    return documentRef.id;
  }

  static async addDoc(props, { parent = null } = {}) {
    let collectionPath = this.getCollectionId();
    let documentRef;

    if (parent) {
      collectionPath = parent.getDocumentPath() + '/' + collectionPath;
    }
    let { id, ...otherProps } = props;

    try {
      if (id) {
        const documentPath = collectionPath + '/' + id;
        documentRef = firestore.doc(documentPath);
        await documentRef.set(otherProps);
      } else {
        const collectionRef = firestore.collection(collectionPath);
        documentRef = collectionRef.doc();
        await documentRef.set(props);
      }
    } catch (error) {
      console.error(error);
    }

    return await this.find(documentRef.id, { parent });
  }

  static deleteById(id, { parent = null } = {}) {
    let documentPath = this.getCollectionId() + '/' + id;
    if (parent) {
      documentPath = parent.getDocumentPath() + '/' + documentPath;
    }

    firestore.doc(documentPath).delete();
  }

  static documentRef({ parent = null } = {}) {
    let collectionPath = this.getCollectionId();
    let documentRef;

    if (parent) {
      collectionPath = parent.getDocumentPath() + '/' + collectionPath;
    }
    const collectionRef = firestore.collection(collectionPath);
    return collectionRef.doc();
  }

  static async find(id, { parent = null } = {}) {
    let documentPath = this.getCollectionId() + '/' + id;
    let result = null;

    if (parent) {
      documentPath = parent.getDocumentPath() + '/' + documentPath;
    }

    let documentRef = firestore.doc(documentPath);
    let itemClass = this;

    let snap = await documentRef.get();
    if (snap.exists) {
      const data = snapToData(snap, 'id');
      result = new itemClass(data, { parent: parent });
    }

    // result.exists = snap.exists;

    // let result = docData(documentRef, 'id').pipe(
    //   map((data) => new itemClass(data, { parent: parent })),
    //   startWith(null)
    // );

    return result;
  }

  static async findAll({
    parent = null,
    where = [],
    andWhere = [],
    order = '',
  } = {}) {
    const itemClass = this;
    let collectionPath = this.getCollectionId();
    let result = [];

    if (parent) {
      collectionPath = parent.getDocumentPath() + '/' + collectionPath;
    }

    let collectionRef = firestore.collection(collectionPath);

    // Where
    if (where.length === 3) {
      collectionRef = collectionRef.where(...where);
      if (andWhere.length === 3) {
        collectionRef = collectionRef.where(...andWhere);
      }
    }

    // Query Snapshot
    let snapshot = await collectionRef.get();

    // Transform to an array of models

    snapshot.forEach((doc) => {
      let data = snapToData(doc, 'id');
      let item = new itemClass(data, { parent: parent });
      result.push(item);
    });

    // Sort Order
    let orderFields = order.split(',');
    if (orderFields.length) {
      result = result.sort((a, b) => {
        let comparison = 0;
        orderFields.forEach((orderField) => {
          if (!comparison) {
            if (a[orderField] < b[orderField]) {
              comparison = -1;
            } else if (a[orderField] > b[orderField]) {
              comparison = 1;
            }
          }
        });
        return comparison;
      });
    }

    // Return Result
    return result;
  }

  static getCollectionId() {
    let result = pluralize(lowerCaseFirstLetter(this.name));
    return result;
  }

  static listen(id, { parent = null } = {}) {
    let documentPath = this.getCollectionId() + '/' + id;

    if (parent) {
      documentPath = parent.getDocumentPath() + '/' + documentPath;
    }

    let documentRef = firestore.doc(documentPath);
    let itemClass = this;

    let result = doc(documentRef).pipe(
      map((snap) => {
        // let snap = await documentRef.get();
        let model = null;
        if (snap.exists) {
          const data = snapToData(snap, 'id');
          model = new itemClass(data, { parent: parent });
        }

        // const data = snapToData(snap, 'id');
        // let result = new itemClass(data, { parent: parent });
        // result.exists = snap.exists;
        return model;
      }),
      startWith(null)
    );

    return result;
  }

  static listenAll({ parent = null, where = [], order = '' } = {}) {
    const itemClass = this;
    let collectionPath = this.getCollectionId();
    let result;

    if (parent) {
      collectionPath = parent.getDocumentPath() + '/' + collectionPath;
    }

    let collectionRef = firestore.collection(collectionPath);

    // Where
    if (where.length === 3) {
      collectionRef = collectionRef.where(...where);
    }

    // Collection Data
    result = collectionData(collectionRef, 'id');

    // Map to Instances of Model
    result = result.pipe(
      map((items) => items.map((it) => new itemClass(it, { parent: parent })))
    );

    // Sort Order
    let orderFields = order.split(',');
    if (orderFields.length) {
      result = result.pipe(
        map((items) => {
          items.sort((a, b) => {
            let comparison = 0;
            orderFields.forEach((orderField) => {
              if (!comparison) {
                if (a[orderField] < b[orderField]) {
                  comparison = -1;
                } else if (a[orderField] > b[orderField]) {
                  comparison = 1;
                }
              }
            });
            return comparison;
          });
          return items;
        })
      );
    }

    // Start With Empty Array
    result = result.pipe(startWith([]));

    // Return Result
    return result;
  }

  static setById(id, props, { parent = null } = {}) {
    let documentPath = this.getCollectionId() + '/' + id;
    if (parent) {
      documentPath = parent.getDocumentPath() + '/' + documentPath;
    }

    firestore.doc(documentPath).set(props, { merge: true });
  }

  static async updateById(id, props, { parent = null } = {}) {
    let documentPath = this.getCollectionId() + '/' + id;
    if (parent) {
      documentPath = parent.getDocumentPath() + '/' + documentPath;
    }

    return await firestore.doc(documentPath).update(props);
  }

  delete() {
    this.constructor.deleteById(this.id, { parent: this.parent });
  }

  getDocumentPath() {
    let result = this.constructor.getCollectionId() + '/' + this.id;
    if (this.parent) {
      result = this.parent.getDocumentPath() + '/' + result;
    }
    return result;
  }

  async update(props) {
    for (let key in props) {
      this[key] = props[key];
    }

    return await this.constructor.updateById(this.id, props, {
      parent: this.parent,
    });
  }
}
