

class Observer {
    notify() {

    }
}

class Subject {
    constructor() {
        this.observers = [];
    }

    registerObserver(fn) {
        this.observers.push(fn);
    }

    notifyAll(data) {
        this.observers.forEach(obj => obj.notify(data));
    }
}

class TagService extends Subject {

    constructor() {
        super();
        this.tagList = [];
    }

    addTag(tagName) {
        this.tagList.push({
            id: this.tagList.length + 1,
            name: tagName
        });
        this.notifyAll(this.tagList, 'add');
    }

    removeTag(tagId) {
        const idx = this.tagList.findIndex(tag => {
            return tag.id == tagId;
        });

        this.tagList.splice(idx, 1);
        this.notifyAll(this.tagList, 'remove');
    }

}

class TagEditorView extends Observer {

    constructor(el) {
        super();
        this.el = el;
        this.tagList = this.el.getElementsByClassName('tagList')[0];
        this.tagInput = this.el.getElementsByClassName('tagInput')[0];
    }

    setEnterHandler(fn) {
        this.tagInput.addEventListener('keypress', event => {
            if (event.keyCode === 13) {
                fn(event.target.value);
                event.target.value = '';
            }
        });
    }

    setRemoveHandler(fn) {
        this.el.addEventListener('click', event => {
            if (event.target.className === 'remove') {
                fn(event.target.dataset.id);
            }
        });
    }

    render(tagList) {
        this.tagList.innerHTML = tagList.map(tag => {
            return `<span class='tagListItem'>
                        ${tag.name}
                        <span class='remove' data-id='${tag.id}'>X</span>
                    </span>`;
        }).join('');
    }

    notify(tagList) {
        this.render(tagList);
    }
}

class TagLabelView extends Observer {

    constructor(el) {
        super();
        this.el = el;
    }

    render(tagList) {
        this.el.innerHTML = `Tag Count : ${tagList.length}`;
    }

    notify(tagList) {
        this.render(tagList);
    }
}

class TagEditorController {

    constructor(service, view) {
        this.tagService = service;
        this.tagView = view;
        this.tagView.setEnterHandler(input => {
            tagService.addTag(input);
        });

        this.tagView.setRemoveHandler(tagName => {
            tagService.removeTag(tagName);
        });
    }

}

const tagService = new TagService();
const tagEditorView = new TagEditorView(document.getElementById("tagEditor"));
const tagLabelView = new TagLabelView(document.getElementById("tagLabel"));
tagService.registerObserver(tagEditorView);
tagService.registerObserver(tagLabelView);

const tagEditorController = new TagEditorController(tagService, tagEditorView);