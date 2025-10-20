
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { Toolbar } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ShiftsService } from './shifts.service';
import { tap } from 'rxjs';
import { Shift } from '../../../models/shift.model';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-shifts',
    standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule,
    Toolbar,
    TableModule,
    ConfirmDialogModule,
    DialogModule
  ],
    templateUrl: 'shifts.component.html',
    providers: [MessageService, ShiftsService, ConfirmationService]
})
export class ShiftsComponent implements OnInit {
    shiftDialog: boolean = false;

    shifts = signal<Shift[]>([]);

    shift!: Shift;

    selectedShifts!: Shift[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private shiftService: ShiftsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.shiftService.getShifts().pipe(
            tap((p) => console.log(JSON.stringify(p))),
        ).subscribe((data) => {
                this.shifts.set(data);

                //
                // this.shiftService.getShifts().then((data) => {
                //     this.shifts.set(data);
                // });

                // this.shiftService.shiftsResult$.subscribe(
                //     (data: any) => {
                //         this.shifts.set(data);
            }
        );

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'Shift ID', header: 'Code', customExportHeader: 'Shift Code' },
            { field: 'Name', header: 'Name' },
            { field: 'GroupName', header: 'Group Name' },
            { field: 'ModifiedDate', header: 'Modified Date' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    public openNew() {
        this.shift = {
            shiftID : 0,
            name: "",
            endTime: "",
            startTime: "",
            modifiedDate: new Date(),
            employeeDepartmentHistories: []
        };
        this.submitted = false;
        this.shiftDialog = true;
    }

    public editShift(shift: Shift) {
        this.shift = { ...shift };
        this.shiftDialog = true;
    }

    public deleteSelectedShifts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected shifts?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.shifts.set(this.shifts().filter((val) => !this.selectedShifts?.includes(val)));
                this.selectedShifts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Shifts Deleted',
                    life: 3000
                });
            }
        });
    }

    public hideDialog() {
        this.shiftDialog = false;
        this.submitted = false;
    }

    public deleteShift(shift: Shift) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + shift.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.shifts.set(this.shifts().filter((val) => val.shiftID !== shift.shiftID));
                this.shift = {
                    shiftID : 0,
                    name: "",
                    endTime: "",
                    startTime: "",
                    modifiedDate: new Date(),
                    employeeDepartmentHistories: []
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Shift Deleted',
                    life: 3000
                });
            }
        });
    }

    private findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.shifts().length; i++) {
            if (this.shifts()[i].shiftID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    private createId(): number {
        let id = 17;
        return ++id;
    }

    public getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    public saveShift() {
        this.submitted = true;
        let _shifts = this.shifts();
        if (this.shift.name?.trim()) {
            if (this.shift.shiftID) {
                _shifts[this.findIndexById(this.shift.shiftID)] = this.shift;
                this.shifts.set([..._shifts]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Shift Updated',
                    life: 3000
                });
            } else {
                this.shift.shiftID = this.createId();
                this.shiftService.createShift(this.shift);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Shift Created',
                    life: 3000
                });
                this.shifts.set([..._shifts, this.shift]);
            }

            this.shiftDialog = false;
            // this.shift = {
            //     ShiftID : 0,
            //     Name : "",
            //     GroupName :"",
            //     ModifiedDate: new Date(),
            //     EmployeeShiftHistories: []
            //  };
        }
    }
}

