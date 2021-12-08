package DTO;

import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskInfo {
    private String title;
    private String description;
    private String owner;
    private String prio;
}


