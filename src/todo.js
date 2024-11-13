import { format, compareAsc } from "date-fns";

function ListItem(description, priorty){
    this.description = description;
    this.priorty = priorty;
}

function List(list){
    this.list = list;
}

function Todo(title, date, list){
    this.title = title; 
    this.date = format(new Date(), "MM/dd/yyyy");
    this.list = new List(list);
}