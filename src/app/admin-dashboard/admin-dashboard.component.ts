import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { LoginService } from '../service/login.service';
import { ModalService } from '../service/modal.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {


  displayedColumns: string[] = ['FirstName', 'LastName', 'PhoneNumber', 'Role'];
  users: any;

  file: any;
  fileName: any;
  selectedField: string = "author";
  
  searchFirst: string = "";
  searchLast: string = "";
  searchPhone: string = "";
  deleteUserResult: boolean = true;
  
  userId!: number;
  operationStatus!: boolean;
  isLoading = false;
  totalRows = 0;
  pageSize = 2;
  currentPage = 0;
  pageSizeOptions: number[] = [2, 5, 10];
  Toast: any = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(private userService: UserService, private loginService: LoginService, private modalService: ModalService,private dataService: DataService) {

    this.getUsers()

  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;



  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchFirst, this.searchLast, this.searchPhone).subscribe(
      (userDto: any) => {
        this.users = userDto.content;
        this.totalRows = userDto.totalElements;
      }, (error) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Something went wrong!!'
        });
      }
    )
  }


  deleteUser(phoneNumber: number) {
    this.modalService.onDelete("Are you sure delete this user?", "DeleteUser").pipe(take(1)).subscribe(result => {
      if (result === true) {

        this.userService.deleteUser(phoneNumber).subscribe((result => {
          this.Toast.fire({
            icon: 'success',
            title: 'Successfully deleted'
          });
          this.getUsers();

        }))

      }

    }, (error) => {
      this.Toast.fire({
        icon: 'error',
        title: 'something went wrong'
      })
    })

  }


  addEditUser(phoneNumber: number) {

    this.modalService.onAddEdit(phoneNumber).pipe(take(1)).subscribe(result => {

      if (result === true) {
        this.getUsers();
        if (phoneNumber == 0) {
          this.Toast.fire({
            icon: 'success',
            title: 'Successfully Added!'
          })
        }
        else {
          this.Toast.fire({
            icon: 'success',
            title: 'Successfully updated!'
          })
        }
      }

    }, (error) => {
      this.Toast.fire({
        icon: 'error',
        title: 'something went wrong'
      })
    })

  }

  setfileName(event: any) {
    if (event.target.files.length > 0) {
      console.log(event);
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
  }
  submitFile() {

    this.dataService.sendFile(this.file,this.selectedField).subscribe(
      (res)=>{
            this.Toast.fire({
              icon: 'success',
              title: 'Successfully Added!'
            })
          
        },
        (error)=>{
          this.Toast.fire({
            icon: 'error',
            title: error
          })
        }
      )
  }
}


